export const dynamicInput = {
  template: (name: string, props: any): string => {
    const { model, field } = props;
    return `
    <Input
      name={${field.name}}
      label={${field.label}}
      placeholder={${field.placeholder}}
      validations={${field.validations}}
    />
    `;
  },
};
