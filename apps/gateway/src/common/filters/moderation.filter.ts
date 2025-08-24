// Created automatically by Cursor AI (2024-08-24)
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ModerationFilter implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return this.moderateText(value);
    } else if (typeof value === 'object') {
      return this.moderateObject(value);
    }
    return value;
  }

  private moderateText(text: string): string {
    // TODO: Implement actual content moderation
    // This is a basic example - in production, use a proper moderation service
    
    const blockedWords = [
      'spam', 'scam', 'fraud', 'illegal', 'hack', 'crack', 'pirate'
    ];
    
    const lowerText = text.toLowerCase();
    
    for (const word of blockedWords) {
      if (lowerText.includes(word)) {
        throw new BadRequestException(`Content contains blocked word: ${word}`);
      }
    }
    
    // Check for excessive caps
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.7 && text.length > 10) {
      throw new BadRequestException('Content contains excessive capitalization');
    }
    
    // Check for excessive punctuation
    const punctuationRatio = (text.match(/[!?]{2,}/g) || []).length;
    if (punctuationRatio > 3) {
      throw new BadRequestException('Content contains excessive punctuation');
    }
    
    return text;
  }

  private moderateObject(obj: any): any {
    const moderated = { ...obj };
    
    for (const [key, value] of Object.entries(moderated)) {
      if (typeof value === 'string') {
        moderated[key] = this.moderateText(value);
      } else if (typeof value === 'object' && value !== null) {
        moderated[key] = this.moderateObject(value);
      }
    }
    
    return moderated;
  }
}
