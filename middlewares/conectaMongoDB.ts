import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';
import { error } from "console";

export const conectrMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    
    //verificar se o banco já está conectado
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    //conectar caso não esteja conectado obtendo a variável preenchida do env
    const {DB_CONEXAO_STRING} = process.env;

    // se a env estive vazia aborta o uso do sistema e avisa o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro : 'ENV de configuração do banco não informado'});
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', error => console.log('Ocorreu erro ao conectar no banco: ${error}'));
    await mongoose.connect(DB_CONEXAO_STRING);
    
    //agora posso seguir para endpoint, pois está tudo conectado
    return handler(req, res);
    
}