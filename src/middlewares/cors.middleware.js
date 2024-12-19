const allowed_origins = [
    'https://frontend-whatsapp-phi.vercel.app/',
    //Agregar dato de Vercel url de frontend
    //ENVIROMEN.FRONTEND.URL mismo cambio en mi .env
];
export const customCorsMiddleware = ((req, res, next) => {
    const origin = req.headers.origin;
    if (allowed_origins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});