# Chat Notifications & Message Persistence - Implementation Guide

## 📋 Overview
Implemented message persistence when chat is disabled and added unread message notifications to the "Open Chat" button.

---

## 🎯 Features Added

### 1. **Message Persistence When Chat is Disabled**
- Messages sent by other users are now stored even when the chat panel is closed
- When the user opens the chat, all messages (including those sent while chat was closed) are visible
- No messages are lost due to chat being disabled

### 2. **Unread Message Badge**
- A red notification badge appears on the "Open Chat" button when there are unread messages
- Badge shows the count of unread messages (e.g., "3", "15", "99+")
- Badge automatically disappears when chat is opened
- Smart positioning: Only shows when chat is closed and there are unread messages

---

## 🔧 Technical Implementation

### How It Works

#### Parent Component (Host.jsx / Client.jsx)
**Before:**
- Chat listener was only active when ChatRoom component was mounted (when chatOpen was true)
- Messages sent while chat was closed were not received

**After:**
- Chat listener is now in the parent component and always active
- Messages are received and stored regardless of whether chat is open or closed
- Unread count is tracked and passed to VideoRoom

```javascript
// Chat message listener - always active
useEffect(() => {
  socket.on("chat", (msg) => {
    setChatMessages((prev) => [...prev, msg]);
    
    // Track unread messages
    if (!chatOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  });
}, [roomId, chatOpen]);

// Clear unread count when chat opens
useEffect(() => {
  if (chatOpen) {
    setUnreadCount(0);
  }
}, [chatOpen]);
```

#### VideoRoom Component
**New Props:**
- `unreadCount` - Number of unread messages (default: 0)

**New Feature:**
- Badge indicator on "Open Chat" button showing unread count

```javascript
export default function VideoRoom({ 
  socket, 
  roomId, 
  role, 
  chatOpen, 
  onOpenChat, 
  unreadCount = 0 // New prop
}) {
  // ...
  {!chatOpen && onOpenChat && (
    <button onClick={onOpenChat} className="relative ...">
      💬 Open Chat
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center 
                        w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )}
}
```

#### ChatRoom Component
**Changes:**
- Removed socket listener for "chat" event (now handled by parent)
- Kept localStorage event listener for "meeting-ended"
- Component still functions the same way, just receives messages from parent

**Message Flow:**
1. User sends message → `socket.emit("chat", ...)` + `setMessages()` (immediate display)
2. Server broadcasts to other users
3. Other users' parent component receives via socket listener and updates state
4. Message appears in ChatRoom through `messages` prop

---

## 📊 Message Flow Diagram

### Sending a Message
```
User Types → Clicks Send
    ↓
ChatRoom.send() function called
    ├→ socket.emit("chat", payload)
    ├→ setMessages(prev => [...prev, payload])  // Immediate display
    ├→ setMsg("")                                 // Clear input
    └→ setIsTyping(false)
```

### Receiving a Message
```
Server receives message from sender
    ↓
Server broadcasts to room (socket.to() - everyone except sender)
    ↓
Recipient's Parent Component listener catches it
    ├→ setChatMessages(prev => [...prev, msg])   // Store message
    └→ setUnreadCount(prev => prev + 1)          // If chat is closed
    ↓
Message appears in ChatRoom through messages prop
```

---

## 🎨 UI/UX Improvements

### Badge Design
- **Color**: Red (RGB: 239, 68, 68) - Indicates urgent/new
- **Position**: Top-right corner of "Open Chat" button
- **Size**: 20px diameter circle
- **Font**: Bold, white text
- **Content**: 
  - Shows exact count if ≤ 99 (e.g., "3", "25")
  - Shows "99+" if count exceeds 99

### Badge Animation
- Smooth appearance when first unread message arrives
- Disappears immediately when chat is opened
- Never distracts from active chat

### Button Styling
- Only shows badge when chat is closed (`!chatOpen === true`)
- Maintains existing button styling and hover effects
- Badge is non-interactive (clicking button opens chat)

---

## 📝 State Management

### New State Variables

#### Host.jsx & Client.jsx
```javascript
const [chatOpen, setChatOpen] = useState(true);           // Existing
const [chatMessages, setChatMessages] = useState([]);    // Existing
const [codeEditorOpen, setCodeEditorOpen] = useState(true); // Existing
const [unreadCount, setUnreadCount] = useState(0);       // NEW
```

### State Flow
1. **chatMessages**: Stores all chat messages (sent and received)
2. **unreadCount**: Tracks number of unread messages
3. **chatOpen**: Toggle state for chat visibility
4. **unreadCount** is cleared when `chatOpen` becomes true

---

## 🔄 Key Implementation Points

### 1. Parent Component Listens for Messages
```javascript
useEffect(() => {
  const handleChat = (msg) => {
    setChatMessages((prev) => [...prev, msg]);
    if (!chatOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };
  socket.on("chat", handleChat);
  return () => socket.off("chat", handleChat);
}, [roomId, chatOpen]);
```

### 2. Unread Count is Cleared on Open
```javascript
useEffect(() => {
  if (chatOpen) {
    setUnreadCount(0);
  }
}, [chatOpen]);
```

### 3. Badge Conditionally Rendered
```javascript
{unreadCount > 0 && (
  <span className="absolute -top-2 -right-2 flex items-center justify-center 
                   w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
    {unreadCount > 99 ? '99+' : unreadCount}
  </span>
)}
```

### 4. Props Passed to VideoRoom
```javascript
<VideoRoom
  socket={socket}
  roomId={roomId}
  role={role}
  chatOpen={chatOpen}
  onOpenChat={() => setChatOpen(true)}
  unreadCount={unreadCount}  // NEW
/>
```

---

## ✅ Testing Checklist

- [ ] Open interview, disable chat
- [ ] Other user sends messages
- [ ] Verify badge appears on "Open Chat" button
- [ ] Verify badge shows correct count
- [ ] Click "Open Chat" button
- [ ] Verify all messages are visible
- [ ] Verify badge disappears after opening chat
- [ ] Send a message while chat is open
- [ ] Close chat and verify message appears in history
- [ ] Send multiple messages with chat closed
- [ ] Verify count increments correctly
- [ ] Test with count > 99 to see "99+" display
- [ ] Test on mobile (responsive)

---

## 🚀 Benefits

1. **Better Communication**: Users never miss messages
2. **User Awareness**: Badge notifies about new messages
3. **Professional UX**: Modern notification pattern
4. **No Data Loss**: Messages persist when chat is disabled
5. **Seamless Integration**: Works with existing chat system
6. **Performance**: No additional socket spam
7. **Responsive Design**: Works on all screen sizes

---

## 📝 Files Modified

1. **Host.jsx**
   - Added chat listener in parent component
   - Added unreadCount state
   - Passes unreadCount to VideoRoom

2. **Client.jsx**
   - Same changes as Host.jsx

3. **VideoRoom.jsx**
   - Added unreadCount prop
   - Added badge UI to "Open Chat" button

4. **ChatRoom.jsx**
   - Removed socket "chat" listener (now in parent)
   - Kept "meeting-ended" listener

---

## 🔮 Future Enhancements

1. **Typing Indicator**: Show when user is typing
2. **Message Read Receipts**: See if messages were read
3. **Typing Animation**: Show "..." when user is typing
4. **Message Timestamps**: Already implemented
5. **Message Reactions**: Add emoji reactions to messages
6. **Message Search**: Search within chat history
7. **Chat Persistence**: Save chat history to database
8. **Desktop Notifications**: Browser notification for new messages
9. **Sound Alert**: Play sound when message received
10. **Chat Export**: Download chat history

---

## 📞 Troubleshooting

**Badge not showing:**
- Check if `unreadCount > 0` in browser console
- Verify chat is actually closed (`chatOpen === false`)
- Check socket connection is active

**Messages not persisting:**
- Verify parent useEffect has correct dependencies
- Check browser console for socket errors
- Ensure socket listener is registered

**Duplicate messages:**
- This shouldn't happen, but if it does, check socket events
- Verify parent listener and ChatRoom don't both receive messages

---

**Last Updated**: 2026-02-07  
**Version**: 1.0  
**Status**: ✅ Ready for Testing
