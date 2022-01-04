import TISAxios from './Instance';

export async function StartProcess(name: string) {
    let message: string = 'error';
    await TISAxios.post(
        `/is/process/start`, {name: name}
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function StartAllProcess() {
    let message: string = 'error';
    await TISAxios.post(
        `/is/process/start-all`,
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function StopProcess(name: string) {
    let message: string = 'error';
    await TISAxios.post(
        `/is/process/stop`, {name: name}
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function StopAllProcess() {
    let message: string = 'error';
    await TISAxios.post(
        `/is/process/stop-all`,
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}