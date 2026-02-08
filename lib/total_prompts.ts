import prompts from '../prompts.json';

export const allPrompts = prompts.json_agg.map(item => ({
    id: item.id,
    prompt: item.prompt,
    title: item.prompt_title,
    prompt_author: item.prompt_author,
    prompt_img: item.prompt_imgUrl
}));

export const testprompts = allPrompts.slice(0,10);
