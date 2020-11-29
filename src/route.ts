import {UserController} from "./controller/UserController"; 
import { uploadProductImages, resizerImages, checkToken } from './middleware/userpic-upload';

export const Routes = [{ 
      method: "get", 
      route: "/users", 
      middleware: [checkToken],
      controller: UserController, action: "getAllUsers" 
   }, { 
      method: "get", 
      middleware: [checkToken],
      route: "/users/:id", controller: UserController, action: "getUserById" 
   }, { 
      method: "post", 
      route: "/users", 
      middleware: [checkToken],
      controller: UserController, action: "createUser" 
   },
   { 
    method: "post", 
    route: "/user/skill", 
    middleware: [checkToken],
    controller: UserController, action: "updateUserSkill" 
   },
   { 
    method: "post", 
    route: "/user/profilePicUpload", 
    middleware: [checkToken,uploadProductImages, resizerImages],
    controller: UserController, action: "uploadPic" 
   },
   { 
      method: "get", 
      route: "/api/external", 
      middleware: [checkToken],
      controller: UserController, action: "checkToken" 
    },
    { 
      method: "put", 
      route: "/user/removeSkill/:skillId", 
      middleware: [checkToken],
      controller: UserController, action: "removeSkill" 
    },
];