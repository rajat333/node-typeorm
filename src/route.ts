import {UserController} from "./controller/UserController"; 
import { uploadProductImages, resizerImages } from './middleware/userpic-upload';

export const Routes = [{ 
      method: "get", 
      route: "/users", 
      middleware: [],
      controller: UserController, action: "getAllUsers" 
   }, { 
      method: "get", 
      middleware: [],
      route: "/users/:id", controller: UserController, action: "getUserById" 
   }, { 
      method: "post", 
      route: "/users", 
      middleware: [],
      controller: UserController, action: "createUser" 
   },
   { 
    method: "post", 
    route: "/user/skill", 
    middleware: [],
    controller: UserController, action: "updateUserSkill" 
   },
   { 
    method: "post", 
    route: "/user/profilePicUpload", 
    middleware: [uploadProductImages, resizerImages],
    controller: UserController, action: "uploadPic" 
   },
];