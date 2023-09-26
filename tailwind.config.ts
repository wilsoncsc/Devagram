import jwt from "jsonwebtoken"
import jwt from "jsonwebtoken"
import md5 from "md5"
import md5 from "md5"
import type { NextApiRequest, NextApiResponse } from "next"
import type { NextApiRequest, NextApiResponse } from "next"
import { NextApiRequest, NextApiResponse } from 'next'
import type { Config } from 'tailwindcss'
import { UsuarioModel } from "../../models/UsuarioModels"
import { UsuarioModel } from "../../models/UsuarioModels"
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg"
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg"
import { UsuarioModel } from './models/UsuarioModels'
import { RespostaPadraoMsg } from './types/RespostaPadraoMsg'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
export const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | any>
) => {

    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
        res.status(500).json({ erro: 'ENV jwt não informada' });
    }

    if (req.method === 'POST') {
        const { login, senha } = req.body;

        const usuariosEncontrados = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({ _id: usuarioEncontrado._id }, MINHA_CHAVE_JWT);
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token
            });
        }
        return res.status(405).json({ erro: 'Usuário ou senha não encontrado' });
    }
    return res.status(405).json({ erro: 'Metódo informado não é válido' });
};
