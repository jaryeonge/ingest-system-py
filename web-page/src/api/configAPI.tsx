import TISAxios from './Instance';

interface configListInterface {
    id: string;
    name: string;
    cron: string;
    input_type: string;
    input_uri: string;
    output_type: string;
    output_uri: string;
}

interface configWithStatusInterface extends configListInterface{
    status: string;
}

export type configArrayType = Array<configListInterface>;
export type configWithStatusArrayType = Array<configWithStatusInterface>;

export interface inputESInterface {
    host: string;
    port: number;
    username: string;
    password: string;
    since: string;
    index: string;
    query: string;
}

export interface inputRDBInterface {
    host: string;
    port: number;
    username: string;
    password: string;
    since: string;
    database: string;
    query: string;
}

export interface outputESInterface {
    host: string;
    port: number;
    username: string;
    password: string;
    id_column: string;
    index: string;
}

export interface outputRDBInterface {
    host: string;
    port: number;
    username: string;
    password: string;
    id_column: string;
    database: string;
}

export interface mappingInterface {
    input_name: string;
    output_name: string;
    type: string;
    splitter: string;
}

export interface configInterface {
    name: string;
    cron: string;
    input_type: string;
    input: inputESInterface | inputRDBInterface;
    output_type: string;
    output: outputESInterface | outputRDBInterface;
    mapping: Array<mappingInterface>;
}

export function instanceOfConfigInterface(object: any): object is configInterface {
    return object.name !== undefined;
}

export function instanceOfInputESInterface(object: any): object is inputESInterface {
    return object.index !== undefined;
}

export function instanceOfOutputESInterface(object: any): object is outputESInterface {
    return object.index !== undefined;
}

export async function CreateConfig(data: configInterface) {
    let message: string = 'error';
    await TISAxios.post(
        `/is/config/create`, data
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function DeleteConfig(name: string) {
    let message: string = 'error';
    await TISAxios.post(
        `/is/config/delete`,
        {name: name}
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function UpdateConfig(data: configInterface) {
    let message: string = 'error';
    await TISAxios.post(
        `/is/config/update`, data
    ).then(function (response) {
        if (response.data !== undefined) {
            message = response.data.toString();
        }
    }).catch(function (error) {
        message = error;
    });
    return message;
}

export async function CheckConfig(name: string) {
    let data: configInterface | string = 'error';
    await TISAxios.post(
        `/is/config/check`, {name: name}
    ).then(function (response) {
        if (response.data !== undefined) {
            data = response.data[0];
        }
    }).catch(function (error) {
        data = error;
    });
    return data;
}

export async function ListConfig() {
    const newData: configArrayType = [];
    await TISAxios.post(
        `/is/config/list`,
    ).then(function (response) {
        if (response.data !== undefined) {
            response.data.forEach((row: { _id: string; name: string; cron: string; input_type: string; input: { host: string; port: number; }; output_type: string; output: { host: string; port: number; }; }) =>
                newData.push({
                    'id': row._id,
                    'name': row.name,
                    'cron': row.cron,
                    'input_type': row.input_type,
                    'input_uri': `${row.input.host}:${row.input.port}`,
                    'output_type': row.output_type,
                    'output_uri': `${row.output.host}:${row.output.port}`,
                })
            );
        }
    }).catch(function (error) {

    });
    return newData;
}

export async function ListConfigWithStatus() {
    const newData: configWithStatusArrayType = [];
    const statusMap: Map<string, string> = new Map<string, string>();

    await TISAxios.post(
        `/is/process/status`,
    ).then(function (response) {
        if (response.data !== undefined) {
            response.data.forEach((row: { name: string; status: string; }) =>
                statusMap.set(row.name, row.status)
            );
        }
    }).catch(function (error) {

    });

    await TISAxios.post(
        `/is/config/list`,
    ).then(function (response) {
        if (response.data !== undefined) {
            response.data.forEach((row: { _id: string; name: string; cron: string; input_type: string; input: { host: string; port: number; }; output_type: string; output: { host: string; port: number; }; }) => {
                let status: string;
                let getStatus: string | undefined = statusMap.get(row.name);
                if (getStatus === undefined) {
                    status = 'ready';
                } else {
                    status = getStatus;
                }

                newData.push({
                    'id': row._id,
                    'name': row.name,
                    'cron': row.cron,
                    'input_type': row.input_type,
                    'input_uri': `${row.input.host}:${row.input.port}`,
                    'output_type': row.output_type,
                    'output_uri': `${row.output.host}:${row.output.port}`,
                    'status': status,
                });
            });
        }
    }).catch(function (error) {

    });
    return newData;
}