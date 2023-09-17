import Link from "next/link";
import React from "react";
import Copy from "@/components/copy";
import { useState } from "react";
import { APIMutate, APIQuery } from "@/api/queryMethod";
import { API } from "@/api/api";
import { PageCenter, PageLoading } from "./pageLoading";
import { GetCreatedTime } from "@/app/[username]/networks/page";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "./alert";
import Button from "./button";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function DashBoard({ service, servicesUser }) {
  const dropUser = async (database, username) => {
    const data = await API.dropUserServices(database, username)
      .then((res) => {
        Toast.success(res?.data?.message);
        servicesUser.refetch();
      })
      .catch((error) => {
        Toast.error(error?.data?.message);
      });
  };
  const [pop, SetPop] = useState(false);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="left">
          <div className="heading">
            <Typography variant="h6" color={'#fff'}>
              connection information
            </Typography>
          </div>
          <div className="db-information">
            <div className="db-container">
              <Typography variant="body3" >
                <b>server name</b>
              </Typography>
              <div className="cpy">
                <h5>{service.service} Server</h5>
              </div>
            </div>
            <div className="db-container">
              <Typography variant="body3" >
                IP address
              </Typography>
              <div className="cpy">
                <h4>{service.ipaddress}</h4>
                <Copy value="MYSQL IP Address" />
              </div>
            </div>
            <div className="db-container">
              <Typography variant="body3" >
                host
              </Typography>
              <div className="cpy">
                <h4>{service.host}</h4>
                <Copy value="MYSQL DNS" />
              </div>
            </div>
            <div className="db-container">
              <Typography variant="body3" >
                port
              </Typography>
              <div className="cpy">
                <h4>{service.port[0]}</h4>
                <Copy className="copy" value="MYSQL Port" />
              </div>
            </div>
          </div>
        </div>
        {service.service == "adminer" ? "" :

          <div className="right">
            {servicesUser.isLoading ? (
              <PageCenter>
                <PageLoading />
              </PageCenter>
            ) : servicesUser.isError ? (
              <PageCenter>
                <h2>{servicesUser.error?.data?.message} 🪪</h2>
              </PageCenter>
            ) : (
              <>
                <div className="table-header">
                  <h3>
                    <Typography variant="h6" color={'#fff'}>
                      {service.service} Server users (you can add upto{" "}   {servicesUser.data?.data?.data?.currentUsers} /{" "}
                      {servicesUser.data?.data?.data?.maxUsers} {" "}
                      users)
                    </Typography>

                  </h3>
                  <Button
                    color="success"
                    value="add"
                    onClick={() => SetPop((a) => !a)}
                  />
                </div>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>No DBs</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesUser.data?.data?.data?.dbusers?.map(
                      (user, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.password}</td>
                          <td>
                            {user.currentNames}/{user.maxNames}
                          </td>
                          <td>{GetCreatedTime(user.createdAt)}</td>
                          <td>
                            {TrashIcon(dropUser, service, user)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        }
      </div>
      {pop && (
        <AddUser
          service={service}
          SetPop={SetPop}
          servicesUser={servicesUser}
        />
      )}
    </div>
  );
}

export default DashBoard;

const AddUser = ({ service, SetPop, servicesUser }) => {
  const [user, setuser] = useState({
    username: "",
    password: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    cpassword: false,
  });

  const changeHandler = (e) => {
    setuser((a) => ({ ...a, [e.target.name]: e.target.value }));
  };

  const Adduser = async () => {
    if (user.username && user.password && user.cpassword) {
      if (user.password == user.cpassword) {
        const adduser = await API.addUserService(service.service, user)
          .then((res) => {
            Toast.success(res?.data?.message);
            servicesUser.refetch();
            SetPop((a) => !a);
          })
          .catch((err) => {
            Toast.error(err?.data?.message);
          });
      } else {
        Toast.error("password and confirm not match");
      }
    } else {
      Toast.error("fill all the fields");
    }
  };
  return (
    <div className="add-user-to-database">
      <div className="add-user-content">
        <div className="user-header">
          add user to <b>{service.service}</b> service
        </div>

        <FormControl>
          <InputLabel htmlFor="username">username</InputLabel>
          <OutlinedInput
            id="username"
            type={"text"}
            size="medium"
            name="username"
            onChange={changeHandler}
            value={user.username}
            label="username"
          />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword.password ? "text" : "password"}
            size="medium"
            name="password"
            onChange={changeHandler}
            value={user.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((a) => ({
                      ...a,
                      password: !showPassword.password,
                    }))
                  }
                >
                  {showPassword.password ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="cpassword">Confirm Password</InputLabel>
          <OutlinedInput
            id="cpassword"
            type={showPassword.cpassword ? "text" : "password"}
            size="medium"
            name="cpassword"
            onChange={changeHandler}
            value={user.cpassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((a) => ({
                      ...a,
                      cpassword: !showPassword.cpassword,
                    }))
                  }
                >
                  {showPassword.cpassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
        <div className="user-add-button">
          <Button value="cancel" onClick={() => SetPop((a) => !a)} />
          <Button value="add user" color="success" onClick={Adduser} />
        </div>
      </div>
    </div>
  );
};
function TrashIcon(dropUser, service, user) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-trash3"
    viewBox="0 0 16 16"
    onClick={() => dropUser(service.service, user.username)}
  >
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
  </svg>;
}

