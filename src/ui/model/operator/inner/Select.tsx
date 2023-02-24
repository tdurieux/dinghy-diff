import { PlanData } from '../PlanData';
import React from 'react';
import { Box, Stack } from '@mui/material';

export const UTF8_SMALL_SIGMA = 'σ';

export class Select extends PlanData {
  public static LABEL = 'Select';

  static isSelect(data: PlanData): data is Select {
    return data.label === Select.LABEL;
  }

  render(): any {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box>{UTF8_SMALL_SIGMA}</Box>
        <Box>SELECT</Box>
      </Stack>
    );
  }
}
