import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashed_password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', true);
