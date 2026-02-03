# KaarYA Messaging System

Welcome to the **KaarYA** student marketplace messaging feature! This demo showcases a fully functional messaging interface designed for student-to-student communication.

## 🎨 Design Philosophy

The messaging interface follows a premium, modern design aesthetic inspired by your reference image:

- **Color Theme**: 
  - Cream background (#F5F3E8)
  - Yellow accents (#F4D03F) for your messages
  - Purple buttons (#5B5FFF) for actions
  - Black borders for that clean, sharp look
  - Green indicators for status

- **UI/UX**: 
  - Clean, bordered message bubbles (WhatsApp/Instagram style)
  - Waveform visualization for voice messages
  - Smooth animations and interactions
  - Gen-Z friendly, modern interface

## 📁 Project Structure

```
KaarYA/
├── app/
│   └── messaging-demo.tsx          # Main messaging screen
├── components/
│   └── messaging/
│       ├── ChatHeader.tsx          # Header with user info & actions
│       ├── MessageBubble.tsx      # Text & audio message bubbles
│       ├── MessageInput.tsx       # Input bar with text & voice
│       └── AudioRecorder.tsx      # Voice recording interface
├── types/
│   └── messaging.ts               # TypeScript interfaces
└── constants/
    └── Colors.ts                   # Brand color palette
```

## ✨ Features

### 1. **Text Messaging**
   - Send and receive text messages
   - Real-time message updates
   - Read receipts (visual status indicators)
   - Timestamp display
   - Message bubbles with distinct colors (yellow for you, white for others)

### 2. **Voice Messages**
   - **Record audio**: Long-press the mic button
   - **Real-time waveform**: Visual feedback while recording
   - **Duration counter**: Track recording length
   - **Playback**: Tap to play/pause voice messages
   - **Cancel recording**: Tap X to discard

### 3. **Attachments** (Coming Soon)
   - Document picker
   - Image gallery
   - Asset sharing

### 4. **UI Components**
   - **Chat Header**: User profile, status indicator, "View Gig" button
   - **Status Bar**: Shows "GIG IN PROGRESS" with green dot
   - **Date Separator**: "TODAY" label with clean divider lines
   - **Message List**: Scrollable chat history
   - **Input Bar**: Action buttons + text input + voice recorder

## 🚀 How to Access

### Navigate to the Messaging Demo:

In your Expo app, navigate to:
```
/messaging-demo
```

Or modify your app's routing to include the messaging screen.

### Test the Features:

1. **Send a text message**: Type in the input field and tap the purple send button
2. **Record audio**: Tap and hold the mic button to start recording
3. **Play audio**: Tap the play button on any voice message
4. **View attachments**: Tap the attach/document/images buttons (alerts for now)

## 🎯 Key Components Explained

### ChatHeader.tsx
- Shows participant's name, avatar, and online status
- Back button for navigation
- "VIEW GIG" button for project context

### MessageBubble.tsx
- Renders both text and audio messages
- Different styling for your messages vs. others
- Audio playback with waveform visualization
- Timestamp and read receipts

### MessageInput.tsx
- Text input with multiline support
- Quick action buttons (attach, documents, images)
- Voice recording toggle
- Automatic keyboard handling

### AudioRecorder.tsx
- Real-time recording with expo-av
- Animated recording indicator (pulsing red dot)
- Live duration counter
- Dynamic waveform visualization
- Send or cancel options

## 🎨 Color Customization

All colors are defined in `constants/Colors.ts`:

```typescript
BrandColors.cream       // Background
BrandColors.yellow      // Your messages
BrandColors.purple      // Action buttons
BrandColors.black       // Borders & text
BrandColors.green       // Status indicators
```

## 🔧 Dependencies

- **expo-av**: Audio recording and playback
- **@expo/vector-icons**: Icons (Ionicons)
- **React Native**: Core framework

### Optional (for future enhancements):
- expo-document-picker
- expo-image-picker

## 💡 Next Steps

To integrate this into your main app:

1. **Add to navigation**: Include `messaging-demo` in your tab navigator or stack
2. **Connect to backend**: Replace mock data with real user data from your database
3. **Add real users**: Fetch user profiles from your student database
4. **Enable file uploads**: Install and configure document/image pickers
5. **Add push notifications**: Notify users of new messages
6. **Implement chat threads**: List all active conversations

## 🎨 Customization Tips

- **Change colors**: Edit `constants/Colors.ts`
- **Modify bubble style**: Update `MessageBubble.tsx` styles
- **Add new features**: Extend the `Message` interface in `types/messaging.ts`
- **Custom animations**: Use React Native Animated API in components

## 📱 Demo Data

The demo includes 3 sample messages showing:
- Text from another user
- Your text reply
- Another text from the other user

You can send new messages to see them appear in real-time!

## 🛠️ Troubleshooting

**Audio not working?**
- Ensure microphone permissions are granted
- Check that expo-av is properly installed
- Test on a physical device (simulator audio can be limited)

**Keyboard issues?**
- The app uses KeyboardAvoidingView for iOS
- Adjust `keyboardVerticalOffset` if needed

**Styling issues?**
- Clear cache: `npx expo start -c`
- Restart the app

---

Built with ❤️ for **KaarYA** - Where students work, by students, for students! 🎓✨
