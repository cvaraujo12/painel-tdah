import { ptBR as materialPtBR } from '@mui/material/locale';
import { ptBR as datePtBR } from '@mui/x-date-pickers/locales';
import { ptBR } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';

export const muiLocale = {
  ...materialPtBR,
  components: {
    MuiLocalizationProvider: {
      defaultProps: {
        localeText: datePtBR.components.MuiLocalizationProvider.defaultProps.localeText,
      },
    },
  },
};

// Combinando os locales para o DatePicker funcionar corretamente
export const dateFnsLocale = {
  ...ptBR,
  ...enUS, // Necessário para o DatePicker funcionar
}; 