import React from "react";
import "./ReviewCard.css";

type ReviewCardProps = {
  username: string;
  profilePic: string;
  title: string;
  stars: number;
  onClick?: () => void;
};

export default function ReviewCard2 ({
  username,
  profilePic,
  title,
  stars,
  onClick,
}: ReviewCardProps) {
  return (
    <div className="review-card" onClick={onClick}>
      {/* Avatar + Name (done by someone else) */}
      <div className = "review-card-content">
        <div className="review-card-header">
            {/* Placeholder gray box for avatar */}
            <div className="avatar-placeholder" />
            {/* Placeholder gray bar for name */}
            <div className="name-placeholder" />
        </div>

        {/* Review Title */}
        <p className="review-title">{title}</p>

        {/* Stars (done by someone else) */}
        <div className="stars-placeholder" />
        </div>
    </div>
  );
}
