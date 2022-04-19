const env = process.env.NODE_ENV
const baseUrl = env === 'development' ? 'https://localhost:3000' : 'https://i-commerce-uk.herokuapp.com';
export default baseUrl;