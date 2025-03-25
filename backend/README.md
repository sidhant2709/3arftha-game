# Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```env
# Database configuration
MONGODB_URI=mongodb+srv://Demo:Demo@cluster0.q0tjt.mongodb.net/gamingapps
JWT_SECRET=your_super_secret_key
EMAIL_SERVICE=gmail
EMAIL_USERNAME=demo@gmail.com
EMAIL_PASSWORD=rf3w4r534r32r


# Server configuration
PORT=9090

NODE_ENV=development
```

# Start the server

```
npm install
npm run dev
```