export const createPeerConnection = (socket, roomId, setRemoteStream) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  })

  pc.onicecandidate = e => {
    if (e.candidate) socket.emit("ice", { roomId, candidate: e.candidate })
  }

  pc.ontrack = e => setRemoteStream(e.streams[0])

  return pc
}

export const addLocalTracks = (pc, stream) => {
  stream.getTracks().forEach(track => pc.addTrack(track, stream))
}

export const createOffer = async (pc, socket, roomId) => {
  if (!pc) return
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  socket.emit("offer", { roomId, offer: pc.localDescription })
}

export const handleOffer = async (pc, offer, socket, roomId) => {
  if (!pc) return
  await pc.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  socket.emit("answer", { roomId, answer: pc.localDescription })
}

export const handleAnswer = async (pc, answer) => {
  if (!pc) return
  await pc.setRemoteDescription(new RTCSessionDescription(answer))
}

export const addIce = async (pc, candidate) => {
  if (!pc || !candidate) return
  await pc.addIceCandidate(new RTCIceCandidate(candidate))
}

export const replaceVideoTrack = async (pc) => {
  const screen = await navigator.mediaDevices.getDisplayMedia({ video: true })
  const sender = pc.getSenders().find(s => s.track.kind === "video")
  sender.replaceTrack(screen.getVideoTracks()[0])
}
export const replaceCameraTrack = async (pc) => {
  const camera = await navigator.mediaDevices.getUserMedia({ video: true })
  const sender = pc.getSenders().find(s => s.track.kind === "video")
  sender.replaceTrack(camera.getVideoTracks()[0])
}
