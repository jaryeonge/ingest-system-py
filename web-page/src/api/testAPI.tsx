import TISAxios from './Instance';

export async function TestProcess(name: string) {
    let data: Array<string> | string = 'error';
    await TISAxios.post(
        `/is/test/process`, {name: name}
    ).then(function (response) {
        if (response.data !== undefined) {
            data = response.data;
        }
    }).catch(function (error) {
        data = error;
    });
    return data;
}