import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import {
    CheckConfig,
    configInterface,
    inputESInterface,
    inputRDBInterface,
    instanceOfConfigInterface,
    instanceOfInputESInterface,
    instanceOfOutputESInterface,
    mappingInterface,
    outputESInterface,
    outputRDBInterface,
    UpdateConfig
} from '../../api/configAPI';

type inputKeys = 'input_host' | 'input_port' | 'input_username' | 'input_password' | 'input_since' | 'input_index' | 'input_database' | 'input_query';
type outputKeys = 'output_host' | 'output_port' | 'output_username' | 'output_password' | 'output_id_column' | 'output_index' | 'output_database';

function UpdateConfigDialog(prop: { receivedName: string }) {
    const name: string = prop.receivedName;
    const [cron, setCron] = useState<string>('');
    const [inputType, setInputType] = useState<string>('elasticsearch');
    const [outputType, setOutputType] = useState<string>('elasticsearch');
    const [input, setInput] = useState({
        input_host: '',
        input_port: '',
        input_username: '',
        input_password: '',
        input_since: '',
        input_index: '',
        input_database: '',
        input_query: '',
    });

    const [output, setOutput] = useState({
        output_host: '',
        output_port: '',
        output_username: '',
        output_password: '',
        output_id_column: '',
        output_index: '',
        output_database: '',
    });

    const [mappingValues, setMappingValues] = useState<Array<mappingInterface>>([
        {'input_name': '', 'output_name': '', 'type': '', 'splitter': ''}
    ]);

    const getData = () => {
        let sendInput: inputESInterface | inputRDBInterface;
        let sendOutput: outputESInterface | outputRDBInterface;
        if (inputType === 'elasticsearch') {
            sendInput = {
                'host': input.input_host,
                'port': parseInt(input.input_port),
                'username': input.input_username,
                'password': input.input_password,
                'index': input.input_index,
                'since': input.input_since,
                'query': input.input_query,
            };
        } else {
            sendInput = {
                'host': input.input_host,
                'port': parseInt(input.input_port),
                'username': input.input_username,
                'password': input.input_password,
                'database': input.input_database,
                'since': input.input_since,
                'query': input.input_query,
            };
        }

        if (outputType === 'elasticsearch') {
            sendOutput = {
                'host': output.output_host,
                'port': parseInt(output.output_port),
                'username': output.output_username,
                'password': output.output_password,
                'index': output.output_index,
                'id_column': output.output_id_column,
            };
        } else {
            sendOutput = {
                'host': output.output_host,
                'port': parseInt(output.output_port),
                'username': output.output_username,
                'password': output.output_password,
                'database': output.output_database,
                'id_column': output.output_id_column,
            };
        }

        let data: configInterface = {
            'name': name,
            'cron': cron,
            'input_type': inputType,
            'input': sendInput,
            'output_type': outputType,
            'output': sendOutput,
            'mapping': mappingValues
        };

        return data;
    }

    const setData = (value: any) => {
        try {
            if (instanceOfConfigInterface(value)) {
                setCron(value.cron);
                if (instanceOfInputESInterface(value.input)) {
                    setInput({
                        'input_host': value.input.host,
                        'input_port': "" + value.input.port,
                        'input_username': value.input.username,
                        'input_password': value.input.password,
                        'input_index': value.input.index,
                        'input_since': value.input.since,
                        'input_query': value.input.query,
                        'input_database': '',
                    });
                } else {
                    setInput({
                        'input_host': value.input.host,
                        'input_port': "" + value.input.port,
                        'input_username': value.input.username,
                        'input_password': value.input.password,
                        'input_index': '',
                        'input_since': value.input.since,
                        'input_query': value.input.query,
                        'input_database': value.input.database,
                    });
                }
                setInputType(value.input_type);

                if (instanceOfOutputESInterface(value.output)) {
                    setOutput({
                        'output_host': value.output.host,
                        'output_port': "" + value.output.port,
                        'output_username': value.output.username,
                        'output_password': value.output.password,
                        'output_index': value.output.index,
                        'output_id_column': value.output.id_column,
                        'output_database': '',
                    });
                } else {
                    setOutput({
                        'output_host': value.output.host,
                        'output_port': "" + value.output.port,
                        'output_username': value.output.username,
                        'output_password': value.output.password,
                        'output_index': '',
                        'output_id_column': value.output.id_column,
                        'output_database': value.output.database,
                    });
                }
                setOutputType(value.output_type);
                setMappingValues(value.mapping);
            } else {
                alert('data is not valid');
            }
        } catch (error) {
            alert('data is not valid');
        }
    }

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files != null) {
            const fileReader: FileReader = new FileReader();
            fileReader.readAsText(event.target.files[0], 'UTF-8');
            fileReader.onload = (event) => {
                if (event.target != null && typeof event.target.result === "string") {
                    setData(JSON.parse(event.target.result));
                } else {
                    alert('data is not valid');
                }
            }
        }
    }

    const handleDownload = async () => {
        const json: string = JSON.stringify(getData());
        const blob = new Blob([json], {type: 'application/json'});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = name + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCron = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCron((event.target as HTMLTextAreaElement).value);
    };

    const handleInputType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputType((event.target as HTMLInputElement).value);
    };

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let inputKey: inputKeys = event.target.id as inputKeys;
        let value: string = event.target.value;
        setInput({
            ...input,
            [inputKey]: value
        });
    };

    const handleOutputType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOutputType((event.target as HTMLInputElement).value);
    };

    const handleOutput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let outputKey: outputKeys = event.target.id as outputKeys;
        let value: string = event.target.value;
        setOutput({
            ...output,
            [outputKey]: value
        });
    };

    const handleMapping = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        let list = [...mappingValues];
        list[index] = {
            ...list[index],
            [event.target.id.slice(0, -index.toString().length)]: event.target.value,
        };
        setMappingValues(list);
    };

    const handleAddMapping = () => {
        setMappingValues([...mappingValues, {'input_name': '', 'output_name': '', 'type': '', 'splitter': ''}])
    }

    const handleRemoveMapping = (index: number) => {
        let list = [...mappingValues];
        list.splice(index, 1);
        setMappingValues(list);
    };

    const handleUpdateConfig = () => {
        UpdateConfig(getData()).then(value => {
            alert(value);
        })
    }

    useEffect(() => {
        CheckConfig(prop.receivedName).then(value => {
            setData(value);
        })
    }, [prop.receivedName])

    return (
        <Container>
            <Grid container spacing={1}>
                <Grid item lg={8} md={8} sm={8} xs={8}>
                    <Typography variant='h5'>프로세스 업데이트</Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}
                >
                    <input
                        type='file'
                        accept='.json'
                        id='upload-file'
                        hidden
                        onChange={(e) => handleUpload(e)}
                    />
                    <label htmlFor='upload-file'>
                        <Button
                            variant='contained'
                            component='span'
                            sx={{ height: '100%'}}
                        >
                            JSON 업로드
                        </Button>
                    </label>
                    <Button
                        variant='contained'
                        onClick={handleDownload}
                        sx={{ ml: 1, height: '100%'}}
                    >
                        JSON 다운로드
                    </Button>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                        disabled
                        id='name'
                        label='name'
                        value={name}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                        id='cron'
                        label='cron'
                        value={cron}
                        onChange={handleCron}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{mt: 2}}>
                    <FormControl component='fieldset'>
                        <FormLabel component='legend'>Input Type</FormLabel>
                        <RadioGroup
                            row
                            aria-label='input_type'
                            name='input_type_group'
                            value={inputType}
                            onChange={handleInputType}
                        >
                            <FormControlLabel value='elasticsearch' control={<Radio />} label='Elasticsearch' />
                            <FormControlLabel value='mysql' control={<Radio />} label='Mysql' />
                            <FormControlLabel value='mssql' control={<Radio />} label='Mssql' />
                            <FormControlLabel disabled value='local' control={<Radio />} label='Local' />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='input_host'
                        label='Input Host'
                        value={input.input_host}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='input_port'
                        label='Input Port'
                        value={input.input_port}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='input_username'
                        label='Input Username'
                        value={input.input_username}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='input_password'
                        label='Input Password'
                        type='password'
                        value={input.input_password}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        id='input_since'
                        label='Input Since'
                        value={input.input_since}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        disabled={inputType !== 'elasticsearch'}
                        required={inputType === 'elasticsearch'}
                        id='input_index'
                        label='Input Index'
                        value={input.input_index}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        disabled={!(inputType === 'mysql' || inputType === 'mssql')}
                        required={inputType === 'mysql' || inputType === 'mssql'}
                        id='input_database'
                        label='Input Database'
                        value={input.input_database}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                        required
                        multiline
                        fullWidth
                        id='input_query'
                        label='Input Query'
                        value={input.input_query}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{mt: 2}}>
                    <FormControl component='fieldset'>
                        <FormLabel component='legend'>Output Type</FormLabel>
                        <RadioGroup
                            row
                            aria-label='output_type'
                            name='output_type_group'
                            value={outputType}
                            onChange={handleOutputType}
                        >
                            <FormControlLabel value='elasticsearch' control={<Radio />} label='Elasticsearch' />
                            <FormControlLabel disabled value='mysql' control={<Radio />} label='Mysql' />
                            <FormControlLabel disabled value='mssql' control={<Radio />} label='Mssql' />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='output_host'
                        label='Output Host'
                        value={output.output_host}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='output_port'
                        label='Output Port'
                        value={output.output_port}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='output_username'
                        label='Output Username'
                        value={output.output_username}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='output_password'
                        label='Output Password'
                        type='password'
                        value={output.output_password}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        required
                        id='output_id_column'
                        label='Output ID Column'
                        value={output.output_id_column}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        disabled={outputType !== 'elasticsearch'}
                        required={outputType === 'elasticsearch'}
                        id='output_index'
                        label='Output Index'
                        value={output.output_index}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3}>
                    <TextField
                        disabled={!(outputType === 'mysql' || outputType === 'mssql')}
                        required={outputType === 'mysql' || outputType === 'mssql'}
                        id='output_database'
                        label='Output Database'
                        value={output.output_database}
                        onChange={handleOutput}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{mt: 2}}>
                    <Grid container spacing={1}>
                        <Grid item lg={10} md={10} sm={10} xs={10}>
                            <Typography variant='subtitle1'>Mapping - length: {mappingValues.length}</Typography>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2}
                              sx={{
                                  display: 'flex',
                                  justifyContent: 'center'
                              }}
                        >
                            <Button
                                variant='contained'
                                onClick={handleAddMapping}
                            >
                                매핑추가
                            </Button>
                        </Grid>
                        {mappingValues.map((value, index) =>
                            <Grid item lg={12} md={12} sm={12} xs={12} key={index}>
                                <Grid container spacing={1}>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <TextField
                                            required
                                            id={'input_name'+index}
                                            label='Input Name'
                                            value={value.input_name}
                                            onChange={e => handleMapping(e, index)}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <TextField
                                            required
                                            id={'output_name'+index}
                                            label='Output Name'
                                            value={value.output_name}
                                            onChange={e => handleMapping(e, index)}
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <TextField
                                            required
                                            id={'type'+index}
                                            label='Type'
                                            value={value.type}
                                            onChange={e => handleMapping(e, index)}
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <TextField
                                            id={'splitter'+index}
                                            label='Splitter'
                                            value={value.splitter}
                                            onChange={e => handleMapping(e, index)}
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2} sx={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                    >
                                        <IconButton
                                            edge='start'
                                            color='inherit'
                                            onClick={() => handleRemoveMapping(index)}
                                        >
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 3,
                }}
                >
                    <Button
                        variant='contained'
                        onClick={handleUpdateConfig}
                        sx={{ height: '100%' }}
                    >
                        업데이트
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default UpdateConfigDialog;