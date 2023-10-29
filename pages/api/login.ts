import type { NextApiRequest, NextApiResponse } from "next";
import {conectrMongoDB} from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {LoginResposta} from '../../types/LoginResposta';
import md5 from 'md5';
import { UsuarioModel } from "../../models/UsuarioModels";
import jwt from 'jsonwebtoken';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg | any>
) => {

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        res.status(500).json({erro : 'ENV jwt não informada'});
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];
            console.log('MINHA_CHAVE_JWT', req.body);
            const token = jwt.sign({_id : usuarioEncontrado._id}, MINHA_CHAVE_JWT);
            
            return res.status(200).json({
                nome : usuarioEncontrado.nome,
                email : usuarioEncontrado.email,
                token});
                
        }
        
        return res.status(405).json({erro : 'Usuário ou senha não encontrado'});
    }
    return res.status(405).json({erro : 'Metódo informado não é válido'});
}

export default conectrMongoDB(endpointLogin);