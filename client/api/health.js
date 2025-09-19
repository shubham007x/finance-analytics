export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  res.status(200).json({
    status: 'OK',
    message: 'Finance Tracker API is running'
  });
}
