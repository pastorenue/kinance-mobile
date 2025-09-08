import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useAppStore } from '../../hooks/useStore';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { budgets, transactions, loading, setBudgets, setTransactions, setLoading } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading('budgets', true);
      setLoading('transactions', true);

      // For now, just set empty arrays since we don't have the API running
      // This prevents crashes when the API is not available
      setBudgets([]);
      setTransactions([]);

      // Uncomment when API is available:
      // const [budgetsResponse, transactionsResponse] = await Promise.all([
      //   apiService.get(ENDPOINTS.BUDGETS.LIST),
      //   apiService.get(ENDPOINTS.TRANSACTIONS.LIST),
      // ]);
      // 
      // if (budgetsResponse.success) {
      //   setBudgets(budgetsResponse.data);
      // }
      // 
      // if (transactionsResponse.success) {
      //   setTransactions(transactionsResponse.data);
      // }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty arrays on error to prevent crashes
      setBudgets([]);
      setTransactions([]);
    } finally {
      setLoading('budgets', false);
      setLoading('transactions', false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.first_name}!
        </Text>
        <Text style={styles.subGreeting}>Here's your financial overview</Text>
      </View>

      {/* Financial Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.budgetCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Total Budget</Text>
          </View>
          <Text style={styles.cardAmount}>${totalBudget.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryCard, styles.spentCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="card-outline" size={24} color="#FF3B30" />
            <Text style={styles.cardTitle}>Total Spent</Text>
          </View>
          <Text style={styles.cardAmount}>${totalSpent.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.remainingCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up-outline" size={24} color="#34C759" />
            <Text style={styles.cardTitle}>Remaining</Text>
          </View>
          <Text style={styles.cardAmount}>${(totalBudget - totalSpent).toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryCard, styles.transactionCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="list-outline" size={24} color="#FF9500" />
            <Text style={styles.cardTitle}>Transactions</Text>
          </View>
          <Text style={styles.cardAmount}>{transactions.length}</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <View style={[
                  styles.transactionIcon,
                  transaction.type === 'income' ? styles.incomeIcon : styles.expenseIcon
                ]}>
                  <Ionicons
                    name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={16}
                    color="#FFF"
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
              ]}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubText}>Start by adding your first transaction</Text>
          </View>
        )}
      </View>

      {/* Budget Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {budgets.length > 0 ? (
          budgets.slice(0, 3).map((budget) => {
            const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            return (
              <View key={budget.id} style={styles.budgetItem}>
                <View style={styles.budgetInfo}>
                  <Text style={styles.budgetName}>{budget.name}</Text>
                  <Text style={styles.budgetAmount}>
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: progress > 90 ? '#FF3B30' : progress > 70 ? '#FF9500' : '#34C759'
                      }
                    ]}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No budgets yet</Text>
            <Text style={styles.emptySubText}>Create your first budget to get started</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  transactionItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#34C759',
  },
  expenseIcon: {
    backgroundColor: '#FF3B30',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  budgetItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});
