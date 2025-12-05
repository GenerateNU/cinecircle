import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { t } from '../il8n/_il8n';
import { UiTextKey } from '../il8n/_keys';
import type { components } from '../types/api-generated';

type Summary = components['schemas']['MovieSummary'];

const AiIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path
      d="M4.3988 9.80993C4.57502 9.93435 4.78556 10.0009 5.00128 10.0004C5.217 9.99984 5.42721 9.93223 5.6028 9.80693C5.7808 9.67693 5.9158 9.49693 5.9898 9.28893L6.4368 7.91593C6.55151 7.57178 6.74465 7.25903 7.00099 7.00235C7.25732 6.74567 7.56982 6.5521 7.9138 6.43693L9.3048 5.98693C9.51046 5.91247 9.68757 5.77536 9.81118 5.59491C9.93478 5.41447 9.99866 5.19979 9.9938 4.98113C9.98894 4.76246 9.91559 4.55083 9.78409 4.37606C9.65259 4.20128 9.46956 4.07218 9.2608 4.00693L7.8858 3.55893C7.54148 3.44435 7.22852 3.25127 6.97166 2.99493C6.7148 2.73859 6.52108 2.42602 6.4058 2.08193L5.9538 0.693926C5.88102 0.489439 5.74631 0.312721 5.56842 0.188358C5.39053 0.0639941 5.1783 -0.00183136 4.96125 3.87718e-05C4.74421 0.0019089 4.53314 0.0713816 4.35742 0.198792C4.18169 0.326203 4.05005 0.505215 3.9808 0.710926L3.5238 2.11093C3.40908 2.44579 3.21988 2.75027 2.97045 3.00143C2.72103 3.25259 2.41787 3.44389 2.0838 3.56093L0.693803 4.00793C0.489399 4.08086 0.312775 4.21563 0.188452 4.39352C0.0641287 4.57141 -0.00172469 4.78359 3.43428e-05 5.00061C0.00179337 5.21763 0.0710775 5.42872 0.198268 5.60457C0.325458 5.78042 0.504244 5.91231 0.709803 5.98193L2.0838 6.42693C2.42988 6.54177 2.74417 6.73623 3.00139 6.99467C3.25861 7.25311 3.45159 7.56831 3.5648 7.91493L4.0168 9.30593C4.0888 9.50993 4.2228 9.68593 4.3988 9.80993ZM4.4838 2.39493L5.0108 1.01793L5.4508 2.39493C5.61432 2.888 5.89094 3.33598 6.25853 3.70305C6.62612 4.07013 7.07449 4.3461 7.5678 4.50893L8.9738 5.03893L7.5918 5.48593C7.09892 5.65001 6.6511 5.92681 6.28395 6.29431C5.91679 6.66181 5.64042 7.10989 5.4768 7.60293L4.9538 8.98093L4.5048 7.60193C4.34345 7.10907 4.06955 6.66056 3.7048 6.29193C3.33548 5.92429 2.88658 5.64647 2.3928 5.47993L1.0148 4.95793L2.4008 4.50793C2.88743 4.33937 3.32879 4.0612 3.6908 3.69493C4.05002 3.32712 4.32116 2.88264 4.4838 2.39493ZM10.5358 13.8519C10.6381 13.9238 10.7557 13.971 10.8794 13.9896C11.003 14.0082 11.1293 13.9978 11.2482 13.9592C11.3672 13.9206 11.4755 13.8548 11.5646 13.7671C11.6537 13.6794 11.7213 13.5722 11.7618 13.4539L12.0098 12.6919C12.0635 12.534 12.1524 12.3904 12.2698 12.2719C12.3878 12.1519 12.5318 12.0639 12.6898 12.0119L13.4618 11.7599C13.6211 11.7049 13.759 11.6011 13.8558 11.4631C13.9525 11.3251 14.0033 11.1601 14.0007 10.9916C13.9982 10.8231 13.9425 10.6597 13.8416 10.5247C13.7407 10.3897 13.5997 10.2901 13.4388 10.2399L12.6748 9.98993C12.5168 9.93701 12.3733 9.84828 12.2553 9.73066C12.1373 9.61304 12.0482 9.46973 11.9948 9.31193L11.7428 8.53893C11.6887 8.37994 11.5859 8.24201 11.449 8.1447C11.3122 8.04738 11.1481 7.9956 10.9802 7.99671C10.8123 7.99782 10.6489 8.05175 10.5133 8.15086C10.3778 8.24997 10.2768 8.38924 10.2248 8.54893L9.9778 9.31093C9.92676 9.46769 9.84018 9.61053 9.72483 9.72831C9.60947 9.84609 9.46846 9.93563 9.3128 9.98993L8.5398 10.2419C8.38075 10.2958 8.24269 10.3984 8.1452 10.5352C8.0477 10.6719 7.99572 10.8359 7.9966 11.0038C7.99749 11.1717 8.0512 11.3351 8.15013 11.4709C8.24906 11.6066 8.38819 11.7077 8.5478 11.7599L9.3108 12.0069C9.4708 12.0609 9.6148 12.1499 9.7328 12.2679C9.8518 12.3869 9.9398 12.5309 9.9908 12.6899L10.2438 13.4639C10.2986 13.6204 10.4006 13.756 10.5358 13.8519ZM9.6228 11.0589L9.4438 11.0009L9.6278 10.9369C9.93032 10.8306 10.2046 10.6568 10.4299 10.4285C10.6551 10.2003 10.8254 9.9238 10.9278 9.61993L10.9858 9.44193L11.0458 9.62293C11.1479 9.92941 11.32 10.2079 11.5484 10.4363C11.7768 10.6647 12.0553 10.8368 12.3618 10.9389L12.5568 11.0019L12.3768 11.0619C12.0697 11.1643 11.7907 11.3369 11.5621 11.5661C11.3335 11.7952 11.1615 12.0746 11.0598 12.3819L11.0008 12.5629L10.9428 12.3829C10.8412 12.0747 10.669 11.7946 10.4398 11.5648C10.2106 11.3351 9.93078 11.1622 9.6228 11.0599"
      fill="#10565D"
    />
  </Svg>
);

type AiConsensusProps = {
  summary: Summary | null;
  summaryLoading: boolean;
  summaryError: string | null;
};

export default function AiConsensus({
  summary,
  summaryLoading,
  summaryError,
}: AiConsensusProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get first sentence from overall for closed state
  const getFirstSentence = (text: string): string => {
    const match = text.match(/^[^.!?]+[.!?]/);
    return match ? match[0] : text;
  };

  return (
    <View style={styles.summaryContainer}>
      {/* Error state */}
      {summaryError && (
        <Text style={styles.summaryErrorText}>{summaryError}</Text>
      )}

      {/* Summary content */}
      {summary && !summaryError && (
        <>
          {/* Header - always visible */}
          <TouchableOpacity
            style={styles.headerRow}
            onPress={() => setIsOpen(!isOpen)}
            activeOpacity={0.7}
          >
            <Text style={styles.consensusLabel}>Consensus</Text>
            <View style={styles.headerRight}>
              <AiIcon />
              <Text style={styles.aiSummaryLabel}>AI Summary</Text>
              <MaterialIcons
                name={isOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
                size={20}
                color="#666"
              />
            </View>
          </TouchableOpacity>

          {/* First sentence - always visible */}
          {summary.overall && (
            <Text style={styles.summaryPreview}>
              {getFirstSentence(summary.overall)}
            </Text>
          )}

          {/* Expanded content */}
          {isOpen && (
            <View style={styles.expandedContent}>
              {/* Pros / Cons */}
              {(summary.pros?.length || summary.cons?.length) && (
                <View style={styles.summaryRow}>
                  {summary.pros && summary.pros.length > 0 && (
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summarySubheader}>Pros</Text>
                      {summary.pros
                        .slice(0, 2)
                        .map((item: string, idx: number) => (
                          <Text key={`pro-${idx}`} style={styles.summaryBullet}>
                            "{item}"
                          </Text>
                        ))}
                    </View>
                  )}

                  {summary.cons && summary.cons.length > 0 && (
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summarySubheader}>Cons</Text>
                      {summary.cons
                        .slice(0, 2)
                        .map((item: string, idx: number) => (
                          <Text key={`con-${idx}`} style={styles.summaryBullet}>
                            "{item}"
                          </Text>
                        ))}
                    </View>
                  )}
                </View>
              )}

              {/* Sentiment percentages */}
              {summary.stats && (
                <Text style={styles.crowdSentiment}>
                  Crowd sentiment: {summary.stats.positivePercent}% positive •{' '}
                  {summary.stats.neutralPercent}% neutral •{' '}
                  {summary.stats.negativePercent}% negative
                </Text>
              )}
            </View>
          )}
        </>
      )}

      {/* Loading state */}
      {summaryLoading && !summary && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.summaryHintText}>
            Analyzing community posts...
          </Text>
        </View>
      )}

      {/* "Empty" state text when no summary yet and no error */}
      {!summary && !summaryError && !summaryLoading && (
        <Text style={styles.summaryHintText}>No consensus available yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consensusLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiSummaryLabel: {
    fontSize: 12,
    color: '#10565D',
    fontWeight: '400',
  },
  summaryPreview: {
    fontSize: 12,
    color: 'black',
  },
  expandedContent: {
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  summaryColumn: {
    flex: 1,
  },
  summarySubheader: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  summaryBullet: {
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
    lineHeight: 20,
    marginBottom: 4,
  },
  crowdSentiment: {
    fontSize: 12,
    color: '#801C03',
    fontWeight: '400',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  summaryErrorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
  },
  summaryHintText: {
    fontSize: 13,
    color: '#777',
    marginTop: 6,
  },
});
