import axios from "axios";

// production

// const API_URL = "https://apibackend.youngstorage.in";

// development
const API_URL = "http://youngstorage.in:9090";

export const Token = () => {
  let token = "";
  if (typeof document !== "undefined") {
    // Access cookies from the document object
    let token = document.cookie
      .split(";")
      .map((a) => a.split("="))
      .filter((a) => a[0].trim() === "token")[0];

    if (token?.length > 1) {
      return token[1];
    } else {
      return token;
    }
  } else {
    return token;
  }
};

const servicesData = {
  mysql: "mysql"
}

export const API = {
  root: () => GetMethod({ url: `${API_URL}` }),
  // this function is to find the authorized user using token
  user: (username) =>
    GetMethod({
      url: `${API_URL}/auth/user/${username}`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  userVerify: (token) =>
    GetMethod({
      url: `${API_URL}/auth/userverify`,
      headers: { Authorization: `Bearer ${token}` },
    }),
  signin: (body) => PostMethod({ url: `${API_URL}/auth/signin`, body }),
  signup: (body) => PostMethod({ url: `${API_URL}/auth/signup`, body }),
  forgotpassword: (body) =>
    PostMethod({ url: `${API_URL}/auth/fotgotpassword`, body }),
  changepassword: (body, token) =>
    PostMethod({
      url: `${API_URL}/auth/changepassword`,
      headers: { Authorization: `Bearer ${token}` },
      body,
    }),
  // contianer build and upcode server API routes
  deploy: () =>
    GetMethod({
      url: `${API_URL}/getcontainer`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  deploySpawn: () =>
    PostMethod({
      url: `${API_URL}/deploy`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  stopContainer: () =>
    GetMethod({
      url: `${API_URL}/stopcontainer`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  upvscode: () =>
    PostMethod({
      url: `${API_URL}/upvscode`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  // network API router
  networks: () =>
    GetMethod({
      url: `${API_URL}/networks`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  addpeer: (body) =>
    PostMethod({
      url: `${API_URL}/addpeer`,
      headers: { Authorization: `Bearer ${Token()}` },
      body,
    }),
  getwgpeer: () =>
    GetMethod({
      url: `${API_URL}/getwgpeer`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  wgpeer: (publicKey, type, res) =>
    PostMethod({
      url: `${API_URL}/wgpeer/${type}`,
      headers: { Authorization: `Bearer ${Token()}` },
      body: { publicKey },
      ...res,
    }),
  peerstatus: (ipaddress) =>
    GetMethod({
      url: `${API_URL}/peerstatus/${ipaddress}`,
      headers: { Authorization: `Bearer ${Token()}` },
    }),
  addomain: (body) =>
    PostMethod({
      url: `${API_URL}/addomain`,
      headers: { Authorization: `Bearer ${Token()}` },
      body,
    }),
  dropDomain: (body) =>
    DeleteMethod({
      url: `${API_URL}/dropdomain`,
      headers: { Authorization: `Bearer ${Token()}` },
      body,
    }),
  // service api config
  services: () => GetMethod({
    url: `${API_URL}/services`,
    headers: { Authorization: `Bearer ${Token()}` },
  }),
  getServices: (database) => GetMethod({
    url: `${API_URL}/${servicesData[database]}/getdata`,
    headers: { Authorization: `Bearer ${Token()}` },
  }),
  addUserService: (database, body) => PostMethod({
    url: `${API_URL}/${servicesData[database]}/addUser`,
    headers: { Authorization: `Bearer ${Token()}` },
    body,
  }),
  dropUserServices: (database, username) => DeleteMethod({
    url: `${API_URL}/${servicesData[database]}/dropUser/${username}`,
    headers: { Authorization: `Bearer ${Token()}` },
  }),
  addDatabaseToUserService: (database, body) => PostMethod({
    url: `${API_URL}/${servicesData[database]}/${body.username}/addDatabase`,
    headers: { Authorization: `Bearer ${Token()}` },
    body,
  }),
  dropDatabaseToUserService: (database, body) => DeleteMethod({
    url: `${API_URL}/${servicesData[database]}/${body.username}/dropDatabase`,
    headers: { Authorization: `Bearer ${Token()}` },
    body,
  }),
};

const GetMethod = async (props) => {
  try {
    const headers = props.headers ?? {}; // Set headers to an empty object if not provided
    const responseType = props.responseType ?? "";
    const response = await axios
      .get(props.url, { headers, responseType })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err.response;
      });
    return response;
  } catch (error) {
    throw error;
  }
};

const PostMethod = async (props) => {
  try {
    const headers = props.headers ?? {};
    const body = props.body ?? {};
    const responseType = props.responseType ?? "";
    const response = await axios
      .post(props.url, body, { headers, responseType })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err.response;
      });
    return response;
  } catch (error) {
    throw error;
  }
};

const PatchMethod = async (props) => {
  try {
    const headers = props.headers ?? {};
    const body = props.body ?? {};
    const response = await axios
      .patch(props.url, body, { headers })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err.response;
      });
    return response;
  } catch (error) {
    throw error;
  }
};

const DeleteMethod = async (props) => {
  try {
    const headers = props.headers ?? {};
    const body = props.body ?? {};
    console.log("body:", body);
    const response = await axios
      .delete(props.url, { headers, data: body })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err.response;
      });
    return response;
  } catch (error) {
    throw error;
  }
};
