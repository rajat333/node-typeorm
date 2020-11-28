import {UserController} from "./controller/UserController"; 

export const Routes = [{ 
      method: "get", 
      route: "/users", 
      controller: UserController, action: "getAllUsers" 
   }, { 
      method: "get", 
      route: "/users/:id", controller: UserController, action: "getUserById" 
   }, { 
      method: "post", 
      route: "/users", 
      controller: UserController, action: "createUser" 
   },
   { 
    method: "post", 
    route: "/user/skill", 
    controller: UserController, action: "updateUserSkill" 
 }
   
];