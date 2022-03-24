import baseUrl from './baseUrl';;

const auth = {};

auth.restoreUserSession = async (dispatcher, method) => {
    let user = await fetch(`${baseUrl}/api/auth`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (user) {
      user = await user.json();
      dispatcher(method(user));
    }
  }

auth.register = async (form) => {
    const data = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    });
    return await data.json();
};

auth.login = async (form) => {
    const data = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    });
    return await data.json();
};

auth.logout = async (dispatcher, method) => {
    await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST'
    });
    dispatcher(method({}))
}

const api = {
    auth
};

export default api;