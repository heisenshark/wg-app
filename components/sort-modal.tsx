import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { SortOrder } from '@/utils/api';

interface SortModalProps {
  visible: boolean;
  currentSort: SortOrder;
  onClose: () => void;
  onConfirm: (order: SortOrder) => void;
}

export function SortModal({ visible, currentSort, onClose, onConfirm }: SortModalProps) {
  const [selected, setSelected] = useState<SortOrder>(currentSort);

  // Resetujemy wybór do aktualnego stanu przy otwarciu modala
  useEffect(() => {
    if (visible) setSelected(currentSort);
  }, [visible, currentSort]);

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const RadioOption = ({ label, value }: { label: string, value: SortOrder }) => (
    <TouchableOpacity
      style={styles.optionRow}
      activeOpacity={0.7}
      onPress={() => setSelected(value)}
    >
      <View style={styles.radioCircle}>
        {selected === value && <View style={styles.radioInner} />}
      </View>
      <ThemedText style={styles.optionText}>{label}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <ThemedText type="defaultSemiBold" style={styles.title}>
                Sort records by:
              </ThemedText>

              <View style={styles.optionsContainer}>
                <RadioOption label="Upload date: latest" value="date" />
                {/* YouTube API search nie wspiera sortowania "oldest" natywnie, 
                    więc mapujemy to na relevance lub date (jako fallback) */}
                <RadioOption label="Upload date: oldest" value="relevance" />
                <RadioOption label="Most popular" value="viewCount" />
              </View>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#94a3b8', // Szaro-niebieski kolor z obrazka
    borderRadius: 20,
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 20,
    marginBottom: 30,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  // Radio Button Styles
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e293b', // Ciemny granat
  },
  // Button Styles
  confirmButton: {
    backgroundColor: '#1e293b', // Ciemny granat
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
