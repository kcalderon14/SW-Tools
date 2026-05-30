export default function handler(req, res) {
  return res.status(410).json({
    message: 'This endpoint is deprecated. Sessions are managed via Firebase Realtime Database.'
  });
}
