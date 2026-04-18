import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {mindmapData, itemId} = await req.json();

    if (!mindmapData) {
      return NextResponse.json(
        {error: 'Missing mindmap data'},
        {status: 400}
      );
    }

    // Log the mindmap data to see its structure
    console.log('\n=== API RECEIVED MINDMAP DATA ===');
    console.log('Data keys:', Object.keys(mindmapData));
    console.log('Full data:', JSON.stringify(mindmapData, null, 2));

    // Convert mindmap to CSV
    const csv = convertMindmapToCSV(mindmapData);
    
    console.log('\n=== GENERATED CSV ===');
    console.log(csv);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mindmap-${itemId}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {error: 'Failed to export mindmap'},
      {status: 500}
    );
  }
}

function convertMindmapToCSV(mindmap: any): string {
  // First, determine the maximum depth of the tree
  function getMaxDepth(node: any, currentDepth: number = 1): number {
    if (!node.children || node.children.length === 0) {
      return currentDepth;
    }
    const childDepths = node.children.map((child: any) => getMaxDepth(child, currentDepth + 1));
    return Math.max(...childDepths);
  }
  
  const maxDepth = getMaxDepth(mindmap);
  
  const rows: string[] = [];
  
  // Recursive function to extract all paths from root to leaves
  function extractPaths(node: any, currentPath: string[] = []): void {
    // Clean content - strip HTML tags
    let content = node.content || '';
    content = content.replace(/<[^>]*>/g, '').trim();
    
    // Add current node to path
    const newPath = [...currentPath, content];
    
    // If this is a leaf node (no children), add the complete path as a row
    if (!node.children || node.children.length === 0) {
      // Pad the path with empty strings to match maxDepth
      while (newPath.length < maxDepth) {
        newPath.push('');
      }
      // Escape quotes and wrap each cell in quotes
      const escapedPath = newPath.map(cell => `"${cell.replace(/"/g, '""')}"`);
      rows.push(escapedPath.join(','));
    } else {
      // Recursively process children
      for (const child of node.children) {
        extractPaths(child, newPath);
      }
    }
  }
  
  // Start extraction from root
  extractPaths(mindmap);
  
  return rows.join('\n');
}
