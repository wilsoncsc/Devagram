import type { NextApiRequest, NextApiResponse } from "next";
import {conectrMongoDB} from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'

const endpointLogin = (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admin@admin.com' &&
        senha === 'Amin@123'){
            return res.status(200).json({mensagem : 'Usuário autenticado com sucesso'});
        }
        return res.status(405).json({erro : 'Usuário ou senha inválido'})
    }
    return res.status(405).json({erro : 'Metódo informado não é válido'});
}

export default conectrMongoDB(endpointLogin);