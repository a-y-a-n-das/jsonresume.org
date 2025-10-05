import { useMemo } from 'react';
import { getNodeBackground, getEdgeStyle } from '../utils/colorUtils';

export function useGraphStyling({
  nodes,
  edges,
  jobInfo,
  username,
  readJobs,
  showSalaryGradient,
  salaryRange,
  filterText,
  filteredNodes,
  selectedNode,
  findPathToResume,
}) {
  const nodesWithStyle = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity:
            filterText && !node.data.isResume && !filteredNodes.has(node.id)
              ? 0.2
              : 1,
          background: getNodeBackground({
            node,
            jobData: jobInfo[node.id],
            username,
            readJobs,
            showSalaryGradient,
            salaryRange,
            filterText,
            filteredNodes,
          }),
        },
      })),
    [
      nodes,
      jobInfo,
      username,
      readJobs,
      showSalaryGradient,
      salaryRange,
      filterText,
      filteredNodes,
    ]
  );

  const edgesWithStyle = useMemo(() => {
    if (!selectedNode) return edges;
    const pathToResume = findPathToResume(edges, selectedNode.id);
    return edges.map((edge) => ({
      ...edge,
      animated: pathToResume.has(edge.id),
      style: getEdgeStyle(edge, pathToResume),
    }));
  }, [edges, selectedNode, findPathToResume]);

  return { nodesWithStyle, edgesWithStyle };
}
