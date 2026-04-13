import { Link } from "react-router-dom";
import type { FeedItem } from "../utils/activityFeed";
import { formatRelativeTime } from "../utils/activityFeed";

interface Props {
  items: FeedItem[];
  /** 로딩 중 여부 (스켈레톤 표시) */
  loading?: boolean;
}

/**
 * 최근 활동 타임라인.
 * - 비어있을 때: 안내 메시지
 * - 각 아이템: 이모지 + 제목 + 부제 + 상대시간
 * - 클릭 시 link로 이동
 */
export function ActivityFeed({ items, loading = false }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-14 rounded-lg bg-brand-subtle/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-dashed border-brand-subtle text-center">
        <p className="text-sm text-brand-textDim">
          아직 학습 기록이 없어요.
        </p>
        <p className="text-xs text-brand-textDim/70 mt-1">
          챕터 퀴즈를 풀거나 강의를 수료하면 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {items.map((item) => {
        const Inner = (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-brand-subtle bg-brand-panel hover:border-brand-primary/40 transition-colors">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-brand-bg flex items-center justify-center text-lg">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-brand-text truncate">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-[11px] text-brand-textDim truncate">
                  {item.subtitle}
                </div>
              )}
            </div>
            <div className="shrink-0 text-[11px] text-brand-textDim/70 whitespace-nowrap">
              {formatRelativeTime(item.timestamp)}
            </div>
          </div>
        );

        return (
          <li key={item.id}>
            {item.link ? (
              <Link to={item.link} className="block">
                {Inner}
              </Link>
            ) : (
              Inner
            )}
          </li>
        );
      })}
    </ol>
  );
}
