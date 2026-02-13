import { ReactNode } from 'react';

export type LifeStage = 'egg' | 'born';
export type PetSpecies = 'dog' | 'cat';
export type PetEmotion = 'idle' | 'happy' | 'thinking';

export type NodeType = 'Subject' | 'Background' | 'Style' | 'MasterGenerator' | 'Pet' | 'Input' | 'IMAGE';

export interface WorkflowNode {
  id: string;
  x: number;
  y: number;
  label?: string;
  type: NodeType;
  color?: string;
  mode?: string;
  icon?: ReactNode;
  status?: 'idle' | 'processing';
  imageUrl?: string;
  prompt?: string;
  parameters?: Record<string, any>;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}