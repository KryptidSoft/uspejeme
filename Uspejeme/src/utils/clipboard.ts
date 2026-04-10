export const copyToClipboard = (value: number | string) => {
  navigator.clipboard.writeText(value.toString());
  alert('Hodnota ' + value + ' byla zkopírována. Teď ji můžeš vložit do jiné kalkulačky!');
};