import {SiteClient} from 'datocms-client';
export default async function recebedorDeRequests(request, response){
    
    if (request.method === 'POST'){
        const TOKEN = '923672314816a3c23408aac7f63222';
        const client = new SiteClient(TOKEN);
        console.log(request.body);
        const registroCriado = await client.items.create({
            itemType: "981086",
            title: request.body.title,
            imageUrl: request.body.imageUrl,
            creatorSlug: request.body.creatorSlug
        })
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        })
        return;
    }
    response.status(404).json({
        message: 'Este metodo tem que ser POST'
    })
}