const { onRequest } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// ─── Razorpay Config ─────────────────────────────────────────────────────────
// Set these via: firebase functions:secrets:set RAZORPAY_KEY_ID
// Or via environment config for local dev
const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
    }

    return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// ─── createRazorpayOrder ──────────────────────────────────────────────────────
// POST { amount (in rupees), gigId, clientId, executorId }
// Returns Razorpay order object
exports.createRazorpayOrder = onRequest({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { amount, gigId, clientId, executorId } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount (in rupees) is required" });
    }

    try {
        const razorpay = getRazorpayInstance();
        const receiptId = gigId ? `gig_${gigId}_${Date.now()}` : `receipt_${Date.now()}`;

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert rupees → paise
            currency: "INR",
            receipt: receiptId,
            notes: {
                gigId: gigId || "",
                clientId: clientId || "",
                executorId: executorId || "",
            },
        });

        // Record the pending order in Firestore
        if (gigId) {
            await db.collection("orders").doc(order.id).set({
                orderId: order.id,
                gigId,
                clientId: clientId || null,
                executorId: executorId || null,
                amount: order.amount,
                currency: order.currency,
                status: "created",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error("createRazorpayOrder error:", error);
        return res.status(500).json({ error: "Failed to create Razorpay order", details: error.message });
    }
});

// ─── verifyRazorpayPayment ────────────────────────────────────────────────────
// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature, gigId }
// Verifies HMAC signature → updates Firestore gig + order on success
exports.verifyRazorpayPayment = onRequest({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, gigId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing required payment parameters" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        return res.status(500).json({ error: "Server misconfiguration: missing Razorpay secret" });
    }

    try {
        // ── HMAC-SHA256 Signature Verification ──
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(body)
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, error: "Invalid payment signature" });
        }

        // ── Update Firestore on verified payment ──
        const batch = db.batch();

        // Update order record
        const orderRef = db.collection("orders").doc(razorpay_order_id);
        batch.update(orderRef, {
            paymentId: razorpay_payment_id,
            status: "paid",
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update gig status to escrow_funded
        if (gigId) {
            const gigRef = db.collection("gigs").doc(gigId);
            batch.update(gigRef, {
                status: "escrow_funded",
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                escrowFundedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        await batch.commit();

        return res.status(200).json({
            success: true,
            message: "Payment verified and escrow funded successfully",
            paymentId: razorpay_payment_id,
        });
    } catch (error) {
        console.error("verifyRazorpayPayment error:", error);
        return res.status(500).json({ success: false, error: "Internal server error during verification" });
    }
});
