import { assert } from 'chai';
const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';

let randomCatId = 0;

describe('Поиск и удаление рандомного кота', async () => {
    it('Получение случайного кота', async () => {
        const status: number = 200;
        const idArr = await CoreApi.getAllCats();
        const randomId = getRandomInt(idArr.data.groups.length);
        const randomCat = getRandomInt(idArr.data.groups[randomId].cats.length);
        randomCatId = idArr.data.groups[randomId].cats[randomCat].id;
        const response = await CoreApi.getCatById(randomCatId);

        allure.logStep(`выполнен запрос GET /get-by-id c параметром ${randomCatId}`);
        allure.testAttachment('testAttachment1', JSON.stringify(response.data, null, 2), 'application/json');

        assert.equal(response.status,status,'Такого кота не существует');
        console.info('Получен случайный кот:', response.data);

    });
    it('Удаление кота', async () => {
        const status: number = 200;
        const response = await CoreApi.removeCat(randomCatId);

        allure.logStep(`выполнен запрос DELETE /remove c параметром ${randomCatId}`);
        allure.testAttachment('testAttachment2', JSON.stringify(response.data, null, 2), 'application/json');

        assert.ok(response.status === status, 'Кот не удалён или уже не существует');
        console.info('Успешно удалён случайный кот');
    });
    it('Поиск удаленного кота', async () => {
        const response = await CoreApi.getCatById(randomCatId);

        allure.logStep(`выполнен запрос GET /get-by-id c параметром ${randomCatId}`);
        allure.testAttachment('testAttachment3', JSON.stringify(response.data, null, 2), 'application/json');

        assert.equal(response, undefined, 'Кот всё ещё существует');
        console.info('Кот более не существует');
        //я закомментила в CoreApi.ts в описании функции getById кэтч, чтобы не выводился весь код ошибки

        //есть проблема с этим решением, если доступ к коту будет закрыт, то по сути он все еще существует,
        //но как распарсить реквест эррор со статусом именно 404, а не каким-то другим, и сравнить, я не понимаю

    });
});