from ingest.config.validator import validate_cron, validate_input, validate_output, validate_mapping


class ProcessConfig:
    def __init__(
            self,
            name: str,
            cron: str,
            input_type: str,
            input: dict,
            output_type: str,
            output: dict,
            mapping: list[dict],
            _id: str = '',
    ):
        self._id = _id
        self.name = name
        self.cron = validate_cron(cron)
        self.input_type = input_type
        self.input = validate_input(input_type, input)
        self.output_type = output_type
        self.output = validate_output(output_type, output)
        self.mapping = validate_mapping(mapping)

    def config_to_dict(self) -> dict:
        return {
            '_id': self._id,
            'name': self.name,
            'cron': self.cron_to_text(),
            'input_type': self.input_type,
            'input': self.input.get_input_config(),
            'output_type': self.output_type,
            'output': self.output.get_output_config(),
            'mapping': self.mapping,
        }

    def cron_to_text(self) -> str:
        if self.cron == '':
            return self.cron
        else:
            return self.cron['minute'] + ' ' + self.cron['hour'] + ' ' + self.cron['day'] + ' ' + self.cron['month'] + ' ' + self.cron['day_of_week']
