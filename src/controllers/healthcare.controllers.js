export const healthCheck = (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "ai-interview-prep-backend",
      timestamp: new Date().toISOString(),
    });
  };
  