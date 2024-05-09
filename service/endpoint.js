import axios from 'axios';
import { http } from "@/services/requests";

const server_url='http://localhost:3000';
// const server_url='https://img-v-b.onrender.com';
//user template

export const test=() =>{
    return axios.get(server_url+'/test');
}

export const createUserTemp=(data) =>{
    return axios.post(server_url+'/user/create-template',data);
}

export const updateUserTemp=(id,data) =>{
    return axios.post(server_url+'/user/update-template/'+id,data);
}

export const getAllUserTemps=() =>{
    return axios.get(server_url+'/user/get-all-templates');
}

export const getUserTempById=(id) =>{
    return axios.get(server_url+'/user/get-specific-template/'+id);
}

//demo template
export const getAllTemps=() =>{
    return axios.get(server_url+'/demo/get-all-templates');
}

export const getTempById = (id) =>{
    return axios.get(server_url+'/demo/get-specific-template/'+id);
}
export const updateTempName=(id,name) =>{
    return axios.post(server_url+'/user/update-template/'+id,{name:name});
}

// /product/get-preview-image/:id
export const getPreviewImage = (keyword, projectToken) => {
    console.log("precall-function");
    return http.post('editor/product/get-preview-image', {
        keyword : keyword, 
        project_token : projectToken
    });
     //return axios.post("/product/get-preview-image",{keyword:keyword});
}

export const getAllDefaultImages = () =>{
    return axios.get(server_url+"/product/get-all-default-images");
}

//get element
export const getAllElements = () =>{
    return axios.get(server_url+'/element/get-all-elements');
}

export const getElementById = (id) =>{
    return axios.get(server_url+'/element/get-specific-element/'+id);
}

export const getShortTags = () =>{
    return http.get('editor/tags/get-all-tags');
    return axios.get(server_url+'/tags/get-all-tags');
}

export const getCanvasSizes = () =>{
    return axios.get(server_url+'/get-all-canvas-sizes');
}

//get shortTag