export default function healthServices(db) {
    return async function(req, res) {
        try {
            await db.query('SELECT 1'); // simple DB check
            res.status(200).json({ status: 'ok', database: 'connected' });
        } catch (err) {
            res.status(500).json({ status: 'fail', database: 'disconnected', error: err.message });
        }
    }
}