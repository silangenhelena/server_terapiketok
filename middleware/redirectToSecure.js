// to direct client using https,
// only working if server using heroku
// The 'x-forwarded-proto' check is for Heroku

const requireHTTPS = async (req, res, next) => {
    try {
        if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
          return res.redirect('https://' + req.get('host') + req.url);
        }
        
        next();
    } catch (error) {
        console.log(error)
    }
}

export default requireHTTPS;