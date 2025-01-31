
import mongoose from "mongoose";


export interface IField {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string,
label: string,
type: string,
validations: any
}

export const fieldSchema = new mongoose.Schema<IField>(
  {
  
        name: {
          type: String,
          required: true,
          
        },
  
        label: {
          type: String,
          required: true,
          
        },
  
        type: {
          type: String,
          required: true,
          
        },
  
        validations: {
          type: Object,
          required: false,
          
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Field =
  mongoose.models.Field || mongoose.model<IField>("Field", fieldSchema);
      