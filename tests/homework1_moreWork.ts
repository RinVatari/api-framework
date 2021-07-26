import { assert } from 'chai';
const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import LikeApi from "../src/http/LikeApi";

let randomCatId = 0;
let response;
let catLikes = 0;
let catDisLikes = 0;
const randomLikes = getRandomInt(42);
const randomDisLikes = getRandomInt(42);

describe('Поставить случайному коту N лайков', async () => {
    it('Получить случайного кота', async () => {
        const idArray = await CoreApi.getAllCats();
        const randomId = getRandomInt(idArray.data.groups.length);
        const randomCat = getRandomInt(idArray.data.groups[randomId].cats.length);
        randomCatId = idArray.data.groups[randomId].cats[randomCat].id;
        response = await CoreApi.getCatById(randomCatId);

        //allure.logStep(`выполнен запрос GET /get-by-id c параметром ${randomCatId}`);
        //allure.testAttachment('testAttachment1', JSON.stringify(response.data, null, 2), 'application/json');

        assert.equal(response.status,200,'Такого кота не существует');
        console.info('Получен случайный кот:', response.data);
    });

    it('Получить количество лайков', async () => {
        catLikes = response.data.cat.likes;
        console.info('Начальное количество лайков:', catLikes);
    });

    it('Поставить N лайков', async () => {
        for (let i = 0; i < randomLikes; i++) {
            await LikeApi.likes(randomCatId, {like:true, dislike:false});
        }
        console.info('Поставлено лайков:', randomLikes);
    });
    it('Проверить количество лайков', async () => {
        response = await CoreApi.getCatById(randomCatId);
        assert.ok(response.data.cat.likes === catLikes + randomLikes,'Количество лайков не соответствует');
        console.info('Текущее количество лайков:', response.data.cat.likes);
    });
});

describe('Поставить случайному коту M дизлайков', async () => {
    it('Получить случайного кота', async () => {
        const idArray = await CoreApi.getAllCats();
        const randomId = getRandomInt(idArray.data.groups.length);
        const randomCat = getRandomInt(idArray.data.groups[randomId].cats.length);
        randomCatId = idArray.data.groups[randomId].cats[randomCat].id;
        response = await CoreApi.getCatById(randomCatId);

        //allure.logStep(`выполнен запрос GET /get-by-id c параметром ${randomCatId}`);
        //allure.testAttachment('testAttachment1', JSON.stringify(response.data, null, 2), 'application/json');

        assert.equal(response.status,200,'Такого кота не существует');
        console.info('Получен случайный кот:', response.data);
    });

    it('Получить количество дизлайков', async () => {
        catDisLikes = response.data.cat.dislikes;
        console.info('Начальное количество дизлайков:', catDisLikes);
    });

    it('Поставить M дизлайков', async () => {
        for (let i = 0; i < randomDisLikes; i++) {
            await LikeApi.likes(randomCatId, {like:false, dislike:true});
        }
        console.info('Поставлено дизлайков:', randomDisLikes);
    });
    it('Проверить количество дизлайков', async () => {
        response = await CoreApi.getCatById(randomCatId);
        assert.ok(response.data.cat.dislikes === catDisLikes + randomDisLikes,'Количество дизлайков не соответствует');
        console.info('Текущее количество дизлайков:', response.data.cat.dislikes);
    });
});