import TISAxios from './Instance';

export interface SinceInterface {
    id: string;
    name: string;
    since: string | number | null;
}

export type SinceArrayType = Array<SinceInterface>;

export async function ListSince() {
    const newData: SinceArrayType = [];
    await TISAxios.post(
        `/is/since/list`,
    ).then(function (response) {
        if (response.data !== undefined) {
            response.data.forEach((row: { _id: string, name: string, since: string | number | null; }) =>
                newData.push({
                    'id': row._id,
                    'name': row.name,
                    'since': row.since
                })
            )
        }
    }).catch(function (error) {

    });
    return newData;
}

export async function ResetSince(name: string) {
    let message: string = 'error';
    await TISAxios.post(
        `/is/since/reset`, {name: name}
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function ResetAllSince() {
    let message: string = 'error';
    await TISAxios.post(
        `/is/since/reset-all`,
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}