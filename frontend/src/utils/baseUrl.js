const env = 'prod'

const baseUrl = env === 'dev' ? 'http://localhost:3000' : 'https://i-commerce-uk.herokuapp.com';
export default baseUrl;