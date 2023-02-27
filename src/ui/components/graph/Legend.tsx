import { Box, Stack } from '@mui/material';
import React from 'react';
import { useQueryPlanState } from '../../state/QueryPlanResultStore';
import { Operator } from '../../model/operator/Operator';
import { TNode } from '../../../semantic-diff/index';
import UnifiedDiffPlanNode from './elements/UnifiedDiffPlanNode';
import Origin from '../../../semantic-diff/tree/Origin';

export function powerSet<T>(arr: T[]): T[][] {
  return arr.reduce(
    (subsets: T[][], value) => subsets.concat(subsets.map((set: T[]) => [value, ...set])),
    [[]]
  );
}

export default function Legend(props: {}) {
  const [qprState] = useQueryPlanState();

  // No legend necessary if no tree or no elements graph
  if (!qprState.resultSelection) {
    return <></>;
  }

  const Boxes = Array(qprState.resultSelection.length)
    .fill(null)
    .map((_, index) => {
      if (!qprState.resultSelection[index]) {
        return <></>;
      }
      const system = qprState.resultSelection[index]!.system;
      const planData = new Operator(system, null, new Map());
      const planNode = new TNode<Operator>(planData, null);
      planNode.origin = new Origin(index, index, system);
      return (
        <Box key={system} width="max-content">
          <UnifiedDiffPlanNode
            data={{
              planNode,
              expandedNodes: [planNode],
              setExpandedNodes: (nodes) => {}
            }}
          />
        </Box>
      );
    });
  return (
    <Stack
      direction="column"
      sx={{
        position: 'absolute',
        bottom: 100,
        left: 20
      }}
      spacing={2}>
      {Boxes}
    </Stack>
  );
}