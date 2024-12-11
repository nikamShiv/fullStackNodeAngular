import { Tag } from "../models/Tag"


export const getAllTags = (filters?: { userId: any; }) => {
    const where:any={};
    if(filters){
        if(filters.userId){
            where.userId=filters.userId;
        }
    }
    return Tag.findAll({where,
        order: [
            ['id', 'DESC']
        ]
    })
}

export const addTag = (name: string, slug: string, userId: number)=>{
    const tag = new Tag();
    tag.name = name; 
    tag.userId = userId;
    tag.slug = slug;
    console.log('tag', tag)

    return tag.save();

}

export async function getTagBySlug(slug: string) {
    const tags = await Tag.findOne({
        where: {
            slug
        }
    });


    return tags;
}
export const getTagById=(id:number)=>{
    return Tag.findByPk(id);
}
export async function deleteTag(id: number) {
    const tag = await Tag.findByPk(id);
    if(!tag){
        throw new Error("Tag not found");
    }
    await tag.destroy()
    return tag;
}
export async function updateTag(name: string,slug:string, id: number) {
    const tag = await Tag.findByPk(id);
    if(!tag){
        throw new Error('Tag not found'); 
    }

    if(name) tag.name = name;
    if(slug) tag.slug = slug;
    await tag.save();

    return tag;
}

export const getTagsByIds = (ids: number[])=>{
    return Tag.findAll({
        where:{
            id: ids 
        }
    });
}