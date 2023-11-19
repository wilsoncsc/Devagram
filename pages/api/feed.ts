import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectrMongoDB} from '../../middlewares/conectaMongoDB';
import { UsuarioModel } from '../../models/UsuarioModels';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { get } from 'http';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === "GET"){
            console.log(req.method);
            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro : 'Usário não encontrado'});
                }
            
                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});

                return res.status(200).json(publicacoes);
            }
        }
        return res.status(405).json({erro : 'Método informado não é válido'});
    }catch(e){
        console.log(e);
    }
    return res.status(400).json({erro : 'Não foi possível obter o feed'});
}

export default validarTokenJWT(conectrMongoDB(feedEndpoint));