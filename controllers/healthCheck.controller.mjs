function healthCheck(_, res) {
    res.status(200).json({
        status: "success",
        message: "Server is healthy and running smoothly ✅",
        uptime: process.uptime().toFixed(2) + " seconds",
        timestamp: new Date().toISOString()
    });
}

export default healthCheck;